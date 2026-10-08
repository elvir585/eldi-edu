#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;
int main() {
    int n;
    long long T;
    cin >> n >> T;
    vector < long long > a(n);
    for (auto & x : a) cin >> x;
    sort(a.begin(), a.end());
    long long s = 0;
    int cnt = 0;
    for (long long x : a) {
        if (s + x > T) break;
        s += x;
        cnt++;
    }
    cout << cnt << "\n";
}
