#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector < long long > a(n);
    for (auto & x : a) cin >> x;
    long long cilj = * max_element(a.begin(), a.end()), zbir = 0;
    for (long long x : a) zbir += cilj - x;
    cout << zbir << '\n';
}
