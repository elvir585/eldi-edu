#include <bits/stdc++.h>
using namespace std;
int main() {
    string s;
    cin >> s;
    vector < char > st;
    bool ok = true;
    for (char c : s) {
        if (c == '(' || c == '[' || c == '{') st.push_back(c);
        else {
            char need = (c == ')' ? '(' : (c == ']' ? '[' : '{'));
            if (st.empty() || st.back() != need) {
                ok = false;
                break;
            }
            st.pop_back();
        }
    }
    cout << (ok && st.empty() ? "DA" : "NE") << "\n";
}
