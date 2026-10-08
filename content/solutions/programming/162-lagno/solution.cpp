#include <bits/stdc++.h>
using namespace std;
int main() {
    vector < string > a(8);
    for (auto & s : a) cin >> s;
    int ans = 0;
    for (int r = 0; r < 8; r++) for (int k = 0; k < 8; k++) {
        if (a [r] [k] != '.') continue;
        int suma = 0;
        for (int dr = - 1; dr <= 1; dr++) for (int dk = - 1; dk <= 1; dk++) {
            if (dr == 0 && dk == 0) continue;
            int x = r + dr, y = k + dk, broj = 0;
            while (x >= 0 && x < 8 && y >= 0 && y < 8 && a [x] [y] == 'B') {
                broj++;
                x += dr;
                y += dk;
            }
            if (x >= 0 && x < 8 && y >= 0 && y < 8 && a [x] [y] == 'C')
                suma += broj;
        }
        ans = max(ans, suma);
    }
    cout << ans << '\n';
}
