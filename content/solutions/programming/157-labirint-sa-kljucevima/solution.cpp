#include <bits/stdc++.h>
using namespace std;
struct S {
    int r, c, m;
}
;
int main() {
    int R, C;
    cin >> R >> C;
    vector < string > g(R);
    int sr = 0, sc = 0;
    for (int r = 0; r < R; r++) {
        cin >> g [r];
        for (int c = 0; c < C; c++) if (g [r] [c] == 'S') sr = r, sc = c;
    }
    vector < vector < array < int, 8 >> > d(R, vector < array < int, 8 >> (C));
    for (auto & row : d) for (auto & a : row) a.fill(- 1);
    queue < S > q;
    d [sr] [sc] [0] = 0;
    q.push({
        sr, sc, 0
    }
    );
    int dr [4] = {
        1, - 1, 0, 0
    }
    , dc [4] = {
        0, 0, 1, - 1
    }
    ;
    while (! q.empty()) {
        auto [r, c, m] = q.front();
        q.pop();
        if (g [r] [c] == 'T') {
            cout << d [r] [c] [m] << "\n";
            return 0;
        }
        for (int k = 0; k < 4; k++) {
            int nr = r + dr [k], nc = c + dc [k];
            if (nr < 0 || nr >= R || nc < 0 || nc >= C || g [nr] [nc] ==
                '#') continue;
            char ch = g [nr] [nc];
            int nm = m;
            if (ch >= 'a' && ch <= 'c') nm |= 1 << (ch - 'a');
            if (ch >= 'A' && ch <= 'C' && ! (m >> (ch - 'A') & 1)) continue;
            if (d [nr] [nc] [nm] < 0) {
                d [nr] [nc] [nm] = d [r] [c] [m] + 1;
                q.push({
                    nr, nc, nm
                }
                );
            }
        }
    }
    cout << - 1 << "\n";
}
