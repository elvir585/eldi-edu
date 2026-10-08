#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    vector < vector < int >> g(n), rg(n);
    while (m--) {
        int u, v;
        cin >> u >> v;
        -- u;
        -- v;
        g [u].push_back(v);
        rg [v].push_back(u);
    }
    vector < char > vis(n);
    vector < int > ord;
    for (int s = 0; s < n; s++) if (! vis [s]) {
        vector < pair < int, int >> st {
            {
                s, 0
            }
        }
        ;
        vis [s] = 1;
        while (! st.empty()) {
            auto & [u, i] = st.back();
            if (i < (int) g [u].size()) {
                int v = g [u] [i++];
                if (! vis [v]) {
                    vis [v] = 1;
                    st.push_back({
                        v, 0
                    }
                    );
                }
            }
            else {
                ord.push_back(u);
                st.pop_back();
            }
        }
    }
    fill(vis.begin(), vis.end(), 0);
    int ans = 0;
    for (int z = n - 1; z >= 0; z--) {
        int s = ord [z];
        if (vis [s]) continue;
        ans++;
        stack < int > st;
        st.push(s);
        vis [s] = 1;
        while (! st.empty()) {
            int u = st.top();
            st.pop();
            for (int v : rg [u]) if (! vis [v]) {
                vis [v] = 1;
                st.push(v);
            }
        }
    }
    cout << ans << "\n";
}
