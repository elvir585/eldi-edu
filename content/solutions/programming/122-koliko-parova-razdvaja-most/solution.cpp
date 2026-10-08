#include <bits/stdc++.h>
using namespace std;
int N;
vector < vector < pair < int, int >> > g;
vector < int > tin, low, sz;
int tim = 0;
long long ans = 0;
void dfs(int u, int pe = - 1) {
    tin [u] = low [u] = tim++;
    sz [u] = 1;
    for (auto [v, id] : g [u]) {
        if (id == pe) continue;
        if (tin [v] != - 1) low [u] = min(low [u], tin [v]);
        else {
            dfs(v, id);
            sz [u] += sz [v];
            low [u] = min(low [u], low [v]);
            if (low [v] > tin [u]) ans += 1LL * sz [v] * (N - sz [v]);
        }
    }
}
int main() {
    int M;
    cin >> N >> M;
    g.assign(N, {
    }
    );
    for (int id = 0; id < M; id++) {
        int u, v;
        cin >> u >> v;
        -- u;
        -- v;
        g [u].push_back({
            v, id
        }
        );
        g [v].push_back({
            u, id
        }
        );
    }
    tin.assign(N, - 1);
    low.resize(N);
    sz.resize(N);
    dfs(0);
    cout << ans << "\n";
}
