#include <iostream>
using namespace std;
int main() {
    int t;
    cin >> t;
    if (t < 15) cout << "HLADNO\n";
    else if (t <= 27) cout << "NORMALNO\n";
    else if (t <= 35) cout << "TOPLO\n";
    else cout << "ALARM\n";
}
