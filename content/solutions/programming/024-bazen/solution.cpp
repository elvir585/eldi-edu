#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector < pair < long long, int >> d;
    for (int i = 0; i < n; i++) {
        long long a, b;
        cin >> a >> b;
        d.push_back({
            a, 1
        }
        );
        d.push_back({
            b, - 1
        }
        );
    }
    sort(d.begin(), d.end());
    int sada = 0, naj = 0;
    for (auto [t, p] : d) {
        sada += p;
        naj = max(naj, sada);
    }
    cout << naj << '\n';
}
