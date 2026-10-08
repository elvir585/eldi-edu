#include <bits/stdc++.h>
using namespace std;
struct Fenwick {
    int n;
    vector < long long > b;
    Fenwick(int n) : n(n), b(n + 1) {
    }
    void add(int i, long long x) {
        for (; i <= n; i += i & - i) b [i] += x;
    }
    long long sum(int i) {
        long long s = 0;
        for (; i > 0; i -= i & - i) s += b [i];
        return s;
    }
}
;
int main() {
    int N, Q;
    cin >> N >> Q;
    Fenwick f(N);
    for (int i = 1; i <= N;++ i) {
        long long x;
        cin >> x;
        f.add(i, x);
    }
    while (Q--) {
        string t;
        int a;
        long long b;
        cin >> t >> a >> b;
        if (t == "ADD") f.add(a, b);
        else cout << f.sum((int) b) - f.sum(a - 1) << "\n";
    }
}
