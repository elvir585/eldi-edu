#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector < long long > a(n);
    vector < pair < long long, int >> p;
    for (int i = 0; i < n; i++) {
        cin >> a [i];
        p.push_back({
            - a [i], i
        }
        );
    }
    sort(p.begin(), p.end());
    vector < int > ans(n);
    long long prev = LLONG_MIN;
    int rank = 0;
    for (int pos = 1; pos <= n; pos++) {
        auto [neg, idx] = p [pos - 1];
        long long x = - neg;
        if (pos == 1 || x != prev) {
            rank = pos;
            prev = x;
        }
        ans [idx] = rank;
    }
    for (int x : ans) cout << x << ' ';
    cout << "\n";
}
