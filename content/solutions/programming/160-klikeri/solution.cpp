#include <bits/stdc++.h>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    int t = a + b, ans = t;
    for (int nb = 1; nb < t; nb++) if ((t - nb) % nb == 0) ans = min(ans,
        abs(nb - b));
    cout << ans << '\n';
}
