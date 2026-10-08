#include <bits/stdc++.h>
using namespace std;
struct Node {
    array < int, 26 > n;
    int cnt = 0;
    Node() {
        n.fill(- 1);
    }
}
;
int main() {
    int N;
    cin >> N;
    vector < Node > tr(1);
    while (N--) {
        string s;
        cin >> s;
        int u = 0;
        for (char ch : s) {
            int c = ch - 'a';
            if (tr [u].n [c] == - 1) {
                tr [u].n [c] = tr.size();
                tr.emplace_back();
            }
            u = tr [u].n [c];
            ++ tr [u].cnt;
        }
    }
    int Q;
    cin >> Q;
    while (Q--) {
        string p;
        cin >> p;
        int u = 0;
        bool ok = true;
        for (char ch : p) {
            int c = ch - 'a';
            if (tr [u].n [c] == - 1) {
                ok = false;
                break;
            }
            u = tr [u].n [c];
        }
        cout << (ok ? tr [u].cnt : 0) << "\n";
    }
}
