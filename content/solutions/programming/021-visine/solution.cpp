#include <bits/stdc++.h>
using namespace std;
int main() {
    int a, g;
    cin >> a >> g;
    int d = (a - g) / 3;
    cout << a - d << '\n' << a - 2 * d << '\n';
}
