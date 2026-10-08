#include <bits/stdc++.h>
using namespace std;
int main() {
    int N, M;
    long long D;
    cin >> N >> M >> D;
    vector < long long > a(N), b(M);
    for (auto & x : a) cin >> x;
    for (auto & x : b) cin >> x;
    sort(a.begin(), a.end());
    sort(b.begin(), b.end());
    int i = 0, j = 0, ans = 0;
    while (i < N && j < M) {
        if (llabs(a [i] - b [j]) <= D) {
            ans++;
            i++;
            j++;
        }
        else if (a [i] < b [j]) i++;
        else j++;
    }
    cout << ans << "\n";
}
