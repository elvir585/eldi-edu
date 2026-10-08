#include <bits/stdc++.h>
using namespace std;
struct S {
    int r, c, u;
}
;
int main() {
    int R, C;
    cin >> R >> C;
    vector < string > g(R);
    int sr = 0, sc = 0, tr = 0, tc = 0;
    for (int r = 0; r < R; r++) {
        cin >> g [r];
        for (int c = 0; c < C; c++) {
            if (g [r] [c] == 'S') sr = r, sc = c;
            if (g [r] [c] == 'T') tr = r, tc = c;
        }
    }
    vector < vector < array < int, 2 >> > d(R, vector < array < int, 2 >>
        (C, array <
        int, 2 > {
        - 1, - 1
    }
    ));
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
        auto [r, c, u] = q.front();
        q.pop();
        if (r == tr && c == tc) {
            cout << d [r] [c] [u] << "\n";
            return 0;
        }
        for (int k = 0; k < 4; k++) {
            int nr = r + dr [k], nc = c + dc [k];
            if (nr < 0 || nr >= R || nc < 0 || nc >= C) continue;
            int nu = u + (g [nr] [nc] == '#');
            if (nu <= 1 && d [nr] [nc] [nu] == - 1) {
                d [nr] [nc] [nu] = d [r] [c] [u] + 1;
                q.push({
                    nr, nc, nu
                }
                );
            }
        }
    }
    cout << - 1 << "\n";
}
