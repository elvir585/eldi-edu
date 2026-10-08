#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    int r = 1, c2 = 0, c5 = 0;
    for (int x = 2; x <= n; x++) {
        int y = x;
        while (y % 2 == 0) {
            c2++;
            y /= 2;
        }
        while (y % 5 == 0) {
            c5++;
            y /= 5;
        }
        r = r * (y % 10) % 10;
    }
    for (int k = 0; k < c2 - c5; k++) r = r * 2 % 10;
    cout << r << "\n";
}
