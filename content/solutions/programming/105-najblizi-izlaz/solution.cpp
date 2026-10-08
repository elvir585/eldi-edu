#include <iostream>
#include <vector>
#include <queue>
#include <string>
#include <algorithm>
using namespace std;
int main() {
    int R, C;
    cin >> R >> C;
    vector < string > g(R);
    for (auto & s : g) cin >> s;
    vector < vector < int >> d(R, vector < int > (C, - 1));
    queue < pair < int, int >> q;
    for (int i = 0; i < R; i++) for (int j = 0; j < C; j++) if (g [i] [j]
        == 'E') {
        d [i] [j] = 0;
        q.push({
            i, j
        }
        );
    }
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
        for (int k = 0; k < 4; k++) {
            int nx = x + dx [k], ny = y + dy [k];
            if (nx >= 0 && nx < R && ny >= 0 && ny < C && g [nx] [ny] !=
                '#' && d
                [nx] [ny] == - 1) {
                d [nx] [ny] = d [x] [y] + 1;
                q.push({
                    nx, ny
                }
                );
            }
        }
    }
    int ans = 0;
    for (int i = 0; i < R; i++) for (int j = 0; j < C; j++) if (g [i] [j]
        != '#') {
        if (d [i] [j] == - 1) {
            cout << - 1 << "\n";
            return 0;
        }
        ans = max(ans, d [i] [j]);
    }
    cout << ans << "\n";
}
