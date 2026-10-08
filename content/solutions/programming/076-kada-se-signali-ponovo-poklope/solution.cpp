#include <bits/stdc++.h>
using namespace std;
int main() {
    long long a, b;
    cin >> a >> b;
    long long g = std::gcd(a, b);
    cout << (a / g) * b << "\n";
}
