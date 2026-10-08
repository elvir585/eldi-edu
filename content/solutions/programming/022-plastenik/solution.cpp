#include <bits/stdc++.h>
using namespace std;
int main() {
    int otvoreni = 0;
    for (int i = 0; i < 3; i++) {
        string s;
        cin >> s;
        if (s == "DA") otvoreni++;
    }
    if (otvoreni == 3) cout << "promaha";
    else if (otvoreni > 0) cout << "vjetrenje";
    else cout << "ustajao vazduh";
    cout << '\n';
}
