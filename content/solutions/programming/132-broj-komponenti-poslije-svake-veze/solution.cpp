#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    vector < int > p(n), s(n, 1);
    iota(p.begin(), p.end(), 0);
    function < int(int) > f = [&] (int x) {
        return p [x] == x ? x : p [x] = f(p [x]);
    }
    ;
    int c = n;
    while (m--) {
        int a, b;
        cin >> a >> b;
        a = f(-- a);
        b = f(-- b);
        if (a != b) {
            if (s [a] < s [b]) swap(a, b);
            p [b] = a;
            s [a] += s [b];
            c--;
        }
        cout << c << "\n";
    }
}
