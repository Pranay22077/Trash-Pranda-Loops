#include <iostream>
using namespace std;
#include <vector>
#include <algorithm>
#include <string>
#include <set>

int main(){

    // ================================ Question 1 =======================================

    // pair <int, string> p1 = {1, "Alice"};
    // pair <int, string> p2 = make_pair(2, "Alic");

    // printf("Pair 1 details: Name = %s, Number = %d\nPair 2 details: Name = %s, Number = %d\n", p1.second, p1.first, p2.second, p2.first);
    // cout << (p1 == p2) <<  endl;

    // ===================================== Question 2 ===================================

    // vector < pair<int, string> > vec;
    // vec.push_back(make_pair(101, "Pranay"));
    // vec.push_back(make_pair(102, "Pruunay"));
    // vec.push_back(make_pair(103, "Yoooo"));

    // int i = 0;
    // for (auto x : vec){
    //     cout << "Student "<< ++i <<": " << x.second << ", Number: " << x.first << endl;
    // }

    // sort(vec.begin(), vec.end());

    // for (auto x : vec){
    //     if(x.first == 102){
    //         cout << "Found" << endl;
    //         break;
    //     }
    // }
    // cout << endl;

    // ================================== Question 3 =======================================

    // vector < pair <  pair <int, int>,  int > > vec = { {{1,2}, 10}, { {3,4}, 20}, {{1,2}, 15}, {{5,6}, 30 } };

    // sort(vec.begin(), vec.end());
    // int i =0;
    // for (auto x : vec){
    //     cout <<"Coordinate " << ++i << ": (" << x.first.first << "," << x.first.second << "), Value: " << x.second << endl;
    // }

    // cout << endl;
    // ================================== Question 4 ========================================

    // vector <int> vec;
    // int i = 0;
    // while (1){
    //     if (++i == 11){
    //         break;
    //     }
    //     vec.push_back(i);
    // }
    // for (auto x : vec){
    //     cout << x << " ";
    // }
    // cout << endl;
    // cout << "Size of vector is "<< vec.size() << endl;
    // cout << "front element: " << vec.front() << " and last element: "<< vec.back() << endl; 
    // cout << "Is vector empty? "<< vec.empty() << endl;
    // vec.clear();

    // for (auto x : vec){
    //     cout << x << " ";
    // }

    // cout << endl;

    // ====================================== Question 5 ====================================

    // vector <int> vec = {10, 20, 30, 40, 50};
    // for (auto x : vec){
    //     cout << x << " ";
    // }
    // cout << endl;
    // vec.insert(vec.begin() + 2, 5);
    // for (auto x : vec){
    //     cout << x << " ";
    // }
    // cout << endl;
    // vec.insert(vec.begin() + 4, 3, 100);
    // for (auto x : vec){
    //     cout << x << " ";
    // }
    // cout << endl;

    // vec.erase(vec.begin() + 1, vec.begin() + 4);
    // for (auto x : vec){
    //     cout << x << " ";
    // }
    // cout << endl;

    // ======================================= Question 6 ===================================

    // vector <int> vec = {10,20,50,60,40,5,90,45};
    // sort(vec.begin(), vec.end());
    // for (auto x : vec){
    //     cout << x << " ";
    // }
    // cout << endl;

    // cout << binary_search(vec.begin(),vec.end(),  40) << endl;
    // auto lb = lower_bound(vec.begin(), vec.end(), 40);
    // auto ub = upper_bound(vec.begin(), vec.end(), 40);

    // if (lb != vec.end()){
    //     cout << *lb << endl;
    // }
    // if (ub != vec.end()){
    //     cout << *ub << endl;
    // }

    // auto it = find(vec.begin(), vec.end(), 60);
    // if (it != vec.end()){
    //     cout << "60 found at: " << (it - vec.begin()) << endl;
    // }

    // ================================== Question 7 ================================

    // vector <int> vec = {1,2,3,4,5,6,7,8,9,10,11};

    // reverse(vec.begin(), vec.end());
    // reverse(vec.begin(), vec.end());

    // rotate(vec.begin(), vec.begin() + 3, vec.end());

    // for (auto x : vec){
    //     cout << x << " ";
    // }
    // cout << endl;

    // =================================== Question 8 =================================

    // vector <int> vec = {1,1,2,2,2,3,3,4,4,4,4,5,5,5,5,5};
    // auto it = unique(vec.begin(), vec.end());
    // vec.erase(it, vec.end());
    // for (auto x : vec){
    //     cout << x << " ";
    // }
    // cout << endl;

    // ================================== Question 9 ==================================

    // set <int> s = {40,30,50,20,10};
    // int i = 0;
    // while (1){
    //     if (++i == 11){
    //         break;
    //     }
    //     s.insert(i);
    // }
    // for (auto x : s){
    //     cout << x << " ";
    // }
    // cout << endl;
    // cout << "Size of set: " <<  s.size() << endl;
    // auto it_f = find(s.begin(), s.end(), 50);
    // if (it_f != s.end()){
    //     cout << "Element found at index: " << distance(s.begin(), it_f) << " and value is " << *it_f << endl;
    // }

    // cout << "Element 40 exists? " << count(s.begin(), s.end(), 40) << endl;

    // s.erase(40);
    // for (auto x : s){
    //     cout << x << " ";
    // }
    // cout << endl;
    // cout << "Is set empty? " << s.empty() << endl;

    // ========================================== Question 10 ======================================

    // set <int>  s = {1,2,3,4,5,6,7,8,9,10};
    // auto it1 = s.find(7);
    // auto it2 = s.find(10);
    // it2++;
    // s.erase(it1, it2);
    // for (auto x : s){
    //     cout << x << " ";
    // }
    // cout << endl;

    // ========================================== Question 11 =======================================

    set <int> s1 = {1,2,3,4,5,6};
    set <int> s2 = {4,5,6,7,8,9};
    set <int> s3 = {10,11};
    set <int> s4;

    set_union(s1.begin(), s1.end(), s2.begin(), s2.end(), inserter(s4, s4.begin()));
    for (auto x : s4){
        cout << x << " ";
    }
    cout << endl;

    set <int> s5;

    set_intersection(s1.begin(), s1.end(), s2.begin(), s2.end(), inserter(s5, s5.begin()));
    for (auto x : s5){
        cout << x << " ";
    }
    cout << endl;

    set <int> s6;

    set_difference(s1.begin(), s1.end(), s2.begin(), s2.end(), inserter(s6, s6.begin()));
    for (auto x : s6){
        cout << x << " ";
    }
    cout << endl;





    


}