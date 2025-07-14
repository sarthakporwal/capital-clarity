import { Suspense } from "react";
import { getUserAccounts } from "@/actions/dashboard";
import { getDashboardData } from "@/actions/dashboard";
import { getCurrentBudget } from "@/actions/budget";
import { AccountCard } from "./_components/account-card";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { BudgetProgress } from "./_components/budget-progress";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { DashboardOverview } from "./_components/transaction-overview";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";

export default async function DashboardPage() {
  const [accounts, transactions] = await Promise.all([
    getUserAccounts(),
    getDashboardData(),
  ]);

  const defaultAccount = accounts?.find((account) => account.isDefault);

  // Get budget for default account
  let budgetData = null;
  if (defaultAccount) {
    budgetData = await getCurrentBudget(defaultAccount.id);
  }

  // Calculate quick stats
  const totalBalance = accounts.reduce((sum, acc) => sum + parseFloat(acc.balance), 0);
  const thisMonthExpenses = transactions
    .filter(t => t.type === "EXPENSE" && new Date(t.date).getMonth() === new Date().getMonth())
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Card */}
      <Card className="bg-gradient-to-br from-blue-50/80 to-purple-50/80 dark:from-blue-900/40 dark:to-purple-900/40 shadow-xl border-0 p-0 overflow-hidden animate-slide-down">
        <CardContent className="flex flex-col md:flex-row items-center justify-between gap-6 py-8 px-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-1">Welcome back!</h2>
            <p className="text-muted-foreground mb-4">Here’s a quick look at your finances this month.</p>
            <div className="flex gap-6 text-center">
              <div>
                <div className="text-lg font-semibold">{accounts.length}</div>
                <div className="text-xs text-muted-foreground">Accounts</div>
              </div>
              <div>
                <div className="text-lg font-semibold">${totalBalance.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">Total Balance</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-red-500">${thisMonthExpenses.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">This Month’s Expenses</div>
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-6 md:mt-0">
            <CreateAccountDrawer>
              <Button variant="outline" className="rounded-lg px-4 py-2 shadow-sm hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors">
                <Plus className="mr-2 h-5 w-5" /> Add Account
              </Button>
            </CreateAccountDrawer>
            <a href="/transaction/create">
              <Button className="rounded-lg px-4 py-2 shadow-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                <Plus className="mr-2 h-5 w-5" /> Add Transaction
              </Button>
            </a>
            <UserButton appearance={{ elements: { avatarBox: "w-10 h-10" } }} />
          </div>
        </CardContent>
      </Card>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="space-y-8 xl:col-span-2">
          {/* Budget Progress */}
          <BudgetProgress
            initialBudget={budgetData?.budget}
            currentExpenses={budgetData?.currentExpenses || 0}
          />

          {/* Dashboard Overview (Recent Transactions & Pie Chart) */}
          <DashboardOverview
            accounts={accounts}
            transactions={transactions || []}
          />
        </div>
        {/* Accounts Grid */}
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
            <CreateAccountDrawer>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-dashed flex items-center justify-center min-h-[120px] animate-fade-in">
                <CardContent className="flex flex-col items-center justify-center text-muted-foreground h-full pt-5">
                  <Plus className="h-10 w-10 mb-2" />
                  <p className="text-sm font-medium">Add New Account</p>
                </CardContent>
              </Card>
            </CreateAccountDrawer>
            {accounts.length > 0 &&
              accounts?.map((account) => (
                <AccountCard key={account.id} account={account} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
