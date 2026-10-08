#include <bits/stdc++.h>
using namespace std;
int main() {
    long long n;
    cin >> n;
    vector < pair < long long, int >> a;
    for (long long p = 2; p * p <= n;++ p) if (n % p == 0) {
        int e = 0;
        while (n % p == 0) {
            n /= p;
            ++ e;
        }
        a.push_back({
            p, e
        }
        );
    }
    if (n > 1) a.push_back({
        n, 1
    }
    );
    for (int i = 0; i < (int) a.size();++ i) {
        if (i) cout << ' ';
        cout << a [i].first << '^' << a [i].second;
    }
    cout << "\n";
}
