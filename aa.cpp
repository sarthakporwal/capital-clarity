#include <bits/stdc++.h>
using namespace std;

int ans;
vector<int> m(26, -1);
vector<bool> usd(10, false);

void bt(int i, const vector<char>& u, const vector<string>& c, const set<char>& f) {
    if (i == u.size()) {
        bool v = true;
        for (char ch : f) {
            if (m[ch - 'A'] == 0) {
                v = false;
                break;
            }
        }
        if (!v) return;
        string w1 = c[0], w2 = c[1], w3 = c[2];
        int l1 = w1.size(), l2 = w2.size(), l3 = w3.size();
        int ml = max({l1, l2, l3});
        int cr = 0;
        bool ok = true;
        for (int col = 0; col < ml; ++col) {
            int d1 = (col < l1) ? m[w1[l1 - 1 - col] - 'A'] : 0;
            int d2 = (col < l2) ? m[w2[l2 - 1 - col] - 'A'] : 0;
            int sm = d1 + d2 + cr;
            if (col < l3) {
                int d3 = m[w3[l3 - 1 - col] - 'A'];
                if (sm % 10 != d3) {
                    ok = false;
                    break;
                }
                cr = sm / 10;
            } else {
                if (sm % 10 != 0) {
                    ok = false;
                    break;
                }
                cr = sm / 10;
            }
        }
        if (ok && cr == 0) ++ans;
        return;
    }
    for (int d = 0; d < 10; ++d) {
        if (!usd[d]) {
            m[u[i] - 'A'] = d;
            usd[d] = true;
            bt(i + 1, u, c, f);
            usd[d] = false;
            m[u[i] - 'A'] = -1;
        }
    }
}

int solution(vector<string> crypt) {
    set<char> l;
    set<char> f;
    for (const auto& w : crypt) {
        if (w.size() > 1) f.insert(w[0]);
        for (char ch : w) l.insert(ch);
    }
    if (l.size() > 10) return 0;
    vector<char> u(l.begin(), l.end());
    ans = 0;
    fill(m.begin(), m.end(), -1);
    fill(usd.begin(), usd.end(), false);
    bt(0, u, crypt, f);
    return ans;
}
