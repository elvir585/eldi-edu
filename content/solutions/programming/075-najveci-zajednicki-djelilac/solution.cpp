#include <bits/stdc++.h>
using namespace std;
int main() {
    long long a, b;
    cin >> a >> b;
    while (b) {
        long long r = a % b;
        a = b;
        b = r;
    }
    cout << a << "\n";
}
