#include <iostream>
#include <algorithm>
using namespace std;
int main() {
    long long p1, p2, z1, z2;
    cin >> p1 >> p2 >> z1 >> z2;
    long long pre = max(0LL, min(p2, z2) - max(p1, z1));
    cout << p2 - p1 - pre << " " << pre << " " << z2 - z1 - pre << "\n";
}
