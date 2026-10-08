#include <bits/stdc++.h>
using namespace std;
int main() {
    int R, C;
    cin >> R >> C;
    vector < string > g(R);
    pair < int, int > s;
    for (int i = 0; i < R; i++) {
        cin >> g [i];
        for (int j = 0; j < C; j++) if (g [i] [j] == 'S') s = {
            i, j
        }
        ;
    }
    vector < vector < int >> d(R, vector < int > (C, - 1));
    queue < pair < int, int >> q;
    d [s.first] [s.second] = 0;
    q.push(s);
    int dx [4] = {
        1, - 1, 0, 0
    }
    , dy [4] = {
        0, 0, 1, - 1
    }
    ;
    while (! q.empty()) {
        auto [x, y] = q.front();
        q.pop();
        if (x == 0 || x == R - 1 || y == 0 || y == C - 1) {
            cout << d [x] [y] << "\n";
            return 0;
        }
        for (int k = 0; k < 4; k++) {
            int nx = x + dx [k], ny = y + dy [k];
            if (nx >= 0 && nx < R && ny >= 0 && ny < C && g [nx] [ny] !=
                '#' && d
                [nx] [ny] < 0) {
                d [nx] [ny] = d [x] [y] + 1;
                q.push({
                    nx, ny
                }
                );
            }
        }
    }
    cout << - 1 << "\n";
}
