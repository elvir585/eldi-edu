#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    vector < long long > a(n);
    for (auto & x : a) cin >> x;
    deque < int > d;
    for (int i = 0; i < n; i++) {
        while (! d.empty() && d.front() < i - k + 1) d.pop_front();
        while (! d.empty() && a [d.back()] <= a [i]) d.pop_back();
        d.push_back(i);
        if (i >= k - 1) cout << a [d.front()] << (i == n - 1 ? '\n' : ' ');
    }
}
