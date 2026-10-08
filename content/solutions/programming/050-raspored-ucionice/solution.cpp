#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector < pair < long long, long long >> a;
    for (int i = 0; i < n; i++) {
        long long s, e;
        cin >> s >> e;
        a.push_back({
            e, s
        }
        );
    }
    sort(a.begin(), a.end());
    long long last = - (1LL << 60);
    int ans = 0;
    for (auto [e, s] : a) if (s >= last) {
        ans++;
        last = e;
    }
    cout << ans << "\n";
}
