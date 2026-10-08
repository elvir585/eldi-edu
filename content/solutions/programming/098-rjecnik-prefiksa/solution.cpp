#include <bits/stdc++.h>
using namespace std;
struct N {
    array < int, 26 > to {
    }
    ;
    int c = 0;
}
;
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    cin >> n >> q;
    vector < N > tr(1);
    while (n--) {
        string s;
        cin >> s;
        int u = 0;
        for (char ch : s) {
            int x = ch - 'a';
            if (! tr [u].to [x]) {
                tr [u].to [x] = tr.size();
                tr.push_back(N());
            }
            u = tr [u].to [x];
            tr [u].c++;
        }
    }
    while (q--) {
        string s;
        cin >> s;
        int u = 0;
        bool ok = 1;
        for (char ch : s) {
            int x = ch - 'a';
            if (! tr [u].to [x]) {
                ok = 0;
                break;
            }
            u = tr [u].to [x];
        }
        cout << (ok ? tr [u].c : 0) << "\n";
    }
}
