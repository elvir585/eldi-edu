#include <iostream>
#include <string>
using namespace std;
int main() {
    int n;
    cin >> n;
    int ans = 0;
    while (n--) {
        string s;
        cin >> s;
        int razred = stoi(s.substr(3, 2));
        int grupa = s.back() - '0';
        if (razred >= 8 && grupa == 3) ans++;
    }
    cout << ans << "\n";
}
