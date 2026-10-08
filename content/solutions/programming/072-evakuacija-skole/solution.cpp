#include <bits/stdc++.h>
using namespace std;
int main() {
    int R, C;
    cin >> R >> C;
    vector < string > g(R);
    for (auto & s : g) cin >> s;
    vector < vector < int >> d(R, vector < int > (C, - 1));
    queue < pair < int, int >> q;
    for (int r = 0; r < R; r++) for (int c = 0; c < C; c++) if (g [r] [c]
        == 'I') {
        d [r] [c] = 0;
        q.push({
            r, c
        }
        );
    }
    int dr [4] = {
        1, - 1, 0, 0
    }
    , dc [4] = {
        0, 0, 1, - 1
    }
    ;
    while (! q.empty()) {
        auto [r, c] = q.front();
        q.pop();
        for (int k = 0; k < 4; k++) {
            int nr = r + dr [k], nc = c + dc [k];
            if (nr >= 0 && nr < R && nc >= 0 && nc < C && g [nr] [nc] !=
                '#' && d
                [nr] [nc] == - 1) {
                d [nr] [nc] = d [r] [c] + 1;
                q.push({
                    nr, nc
                }
                );
            }
        }
    }
    int ans = 0;
    for (int r = 0; r < R; r++) for (int c = 0; c < C; c++) if (g [r] [c]
        == 'U') {
        if (d [r] [c] < 0) {
            cout << - 1 << "\n";
            return 0;
        }
        ans = max(ans, d [r] [c]);
    }
    cout << ans << "\n";
}
