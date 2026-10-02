#ifndef BINARY_TREE_H
#define BINARY_TREE_H

typedef struct TreeNode {
    int value;
    struct TreeNode *left;
    struct TreeNode *right;
} TreeNode;

TreeNode *bt_create(int value);
void bt_insert(TreeNode **root, int value);
int bt_contains(const TreeNode *root, int value);
void bt_destroy(TreeNode **root);
int bt_height(const TreeNode *root);

#endif
