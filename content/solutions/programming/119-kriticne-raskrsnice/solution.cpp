#include <bits/stdc++.h>
using namespace std;
vector < vector < int >> g;
vector < int > tin, low;
vector < char > cut;
int timer = 0;
void dfs(int u, int p = - 1) {
    tin [u] = low [u] = timer++;
    int ch = 0;
    for (int v : g [u]) {
        if (v == p) continue;
        if (tin [v] != - 1) low [u] = min(low [u], tin [v]);
        else {
            dfs(v, u);
            low [u] = min(low [u], low [v]);
            if (p != - 1 && low [v] >= tin [u]) cut [u] = 1;
            ++ ch;
        }
    }
    if (p == - 1 && ch > 1) cut [u] = 1;
}
int main() {
    int N, M;
    cin >> N >> M;
    g.resize(N);
    while (M--) {
        int a, b;
        cin >> a >> b;
        -- a;
        -- b;
        g [a].push_back(b);
        g [b].push_back(a);
    }
    tin.assign(N, - 1);
    low.resize(N);
    cut.assign(N, 0);
    for (int i = 0; i < N;++ i) if (tin [i] == - 1) dfs(i);
    cout << count(cut.begin(), cut.end(), 1) << "\n";
}
