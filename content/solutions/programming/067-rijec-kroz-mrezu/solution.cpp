#include <bits/stdc++.h>
using namespace std;
int R, C;
vector < string > g;
string w;
bool dfs(int r, int c, int k) {
    if (r < 0 || r >= R || c < 0 || c >= C || g [r] [c] != w [k]) return false;
    if (k == (int) w.size() - 1) return true;
    char ch = g [r] [c];
    g [r] [c] = '#';
    bool ok = dfs(r + 1, c, k + 1) || dfs(r - 1, c, k + 1) || dfs(r, c + 1,
        k + 1) ||
        dfs(r, c - 1, k + 1);
    g [r] [c] = ch;
    return ok;
}
int main() {
    cin >> R >> C;
    g.resize(R);
    for (auto & s : g) cin >> s;
    cin >> w;
    for (int r = 0; r < R;++ r) for (int c = 0; c < C;++ c) if (dfs(r, c, 0)) {
        cout << "DA\n";
        return 0;
    }
    cout << "NE\n";
}
