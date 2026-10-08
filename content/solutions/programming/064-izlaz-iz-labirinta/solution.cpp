#include <iostream>
#include <vector>
#include <queue>
#include <string>
using namespace std;
int main() {
    int R, C;
    cin >> R >> C;
    vector < string > g(R);
    for (auto & s : g) cin >> s;
    int sr = 0, sc = 0, er = 0, ec = 0;
    for (int i = 0; i < R; i++) for (int j = 0; j < C; j++) {
        if (g [i] [j] == 'S') sr = i, sc = j;
        if (g [i] [j] == 'E') er = i, ec = j;
    }
    vector < vector < int >> d(R, vector < int > (C, - 1));
    queue < pair < int, int >> q;
    q.push({
        sr, sc
    }
    );
    d [sr] [sc] = 0;
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
    cout << d [er] [ec] << "\n";
}
