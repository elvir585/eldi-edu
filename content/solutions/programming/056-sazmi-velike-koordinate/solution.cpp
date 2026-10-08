#include <bits/stdc++.h>
using namespace std;
int main() {
    int N;
    cin >> N;
    vector < long long > A(N), v;
    for (auto & x : A) cin >> x;
    v = A;
    sort(v.begin(), v.end());
    v.erase(unique(v.begin(), v.end()), v.end());
    for (int i = 0; i < N;++ i) {
        if (i) cout << ' ';
        cout << lower_bound(v.begin(), v.end(), A [i]) - v.begin() + 1;
    }
    cout << "\n";
}
