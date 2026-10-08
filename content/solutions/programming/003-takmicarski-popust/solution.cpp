#include <iostream>
using namespace std;
int main() {
    long long n, c, t, d;
    cin >> n >> c >> t >> d;
    long long iznos = n * c;
    if (iznos >= t) iznos = iznos * (100 - d) / 100;
    cout << iznos << "\n";
}
