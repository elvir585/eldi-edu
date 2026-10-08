#include <iostream>
#include <cstdlib>
using namespace std;
int main() {
    long long a, b, c;
    cin >> a >> b >> c;
    long long bus = a + b;
    cout << (bus <= c ? "AUTOBUS" : "VOZ") << "\n";
    cout << llabs(bus - c) << "\n";
    return 0;
}
