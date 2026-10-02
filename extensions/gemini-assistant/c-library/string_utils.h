#ifndef STRING_UTILS_H
#define STRING_UTILS_H

char *su_strdup_safe(const char *src);
char *su_trim(char *str);
char *su_join(const char *left, const char *right);
char *su_to_upper(const char *src);

#endif
