#include <bits/stdc++.h>
using namespace std;
int main() {
    int N;
    cin >> N;
    vector < long long > t;
    while (N--) {
        long long x;
        cin >> x;
        auto it = lower_bound(t.begin(), t.end(), x);
        if (it == t.end()) t.push_back(x);
        else * it = x;
    }
    cout << t.size() << "\n";
}
