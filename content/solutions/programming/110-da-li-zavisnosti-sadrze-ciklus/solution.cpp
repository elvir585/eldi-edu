#include <bits/stdc++.h>
using namespace std;
vector < vector < int >> g;
vector < int > color;
bool dfs(int u) {
    color [u] = 1;
    for (int v : g [u]) {
        if (color [v] == 1) return true;
        if (color [v] == 0 && dfs(v)) return true;
    }
    color [u] = 2;
    return false;
}
int main() {
    int N, M;
    cin >> N >> M;
    g.resize(N);
    color.assign(N, 0);
    while (M--) {
        int a, b;
        cin >> a >> b;
        g [a - 1].push_back(b - 1);
    }
    for (int i = 0; i < N;++ i) if (! color [i] && dfs(i)) {
        cout << "DA\n";
        return 0;
    }
    cout << "NE\n";
}
