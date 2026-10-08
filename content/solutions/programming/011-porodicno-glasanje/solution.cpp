#include <iostream>
#include <vector>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    vector < long long > g(n + 1, 0);
    while (m--) {
        int a, b;
        cin >> a >> b;
        g [a] += b;
    }
    int win = 1;
    for (int i = 2; i <= n; i++) if (g [i] > g [win]) win = i;
    cout << win << "\n";
}
