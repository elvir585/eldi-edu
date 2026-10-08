#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    cout << n / 5 << '\n';
    n %= 5;
    cout << n / 2 << '\n' << n % 2 << '\n';
}
