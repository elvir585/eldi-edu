#include <iostream>
using namespace std;
int main() {
    long long n, s;
    unsigned long long k;
    cin >> n >> s >> k;
    cout << ((s - 1 + k % n) % n) + 1 << "\n";
}
