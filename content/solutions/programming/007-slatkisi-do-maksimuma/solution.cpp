#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector < long long > a(n);
    for (auto & x : a) cin >> x;
    long long m = * max_element(a.begin(), a.end()), ans = 0;
    for (long long x : a) ans += m - x;
    cout << ans << "\n";
}
