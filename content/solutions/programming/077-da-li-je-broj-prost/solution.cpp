#include <bits/stdc++.h>
using namespace std;
int main() {
    long long n;
    cin >> n;
    if (n < 2) {
        cout << "NE\n";
        return 0;
    }
    for (long long d = 2; d * d <= n;++ d) if (n % d == 0) {
        cout << "NE\n";
        return 0;
    }
    cout << "DA\n";
}
