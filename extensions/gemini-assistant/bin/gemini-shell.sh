#!/usr/bin/env bash

# Gemini C Assistant - Interactive Shell Script
# Complements the CLI tool for quick C code generation and analysis

set -e

DISPLAY_SET=${DISPLAY:-":0"}
echo "🎯 Gemini C Assistant (Bash Shell)"
echo "Display: $DISPLAY_SET"
echo ""

# Check for X11
if ! command -v xdpyinfo &> /dev/null; then
    echo "⚠️  X11 not available. Running in headless mode."
fi

# Function to analyze C file
analyze_c_file() {
    local file=$1
    echo "📄 Analyzing: $file"
    echo ""
    
    echo "Functions:"
    grep -E '^[a-zA-Z_][a-zA-Z0-9_]*\s+[a-zA-Z_][a-zA-Z0-9_]*\s*\(' "$file" 2>/dev/null || echo "  None found"
    echo ""
    
    echo "Includes:"
    grep -E '#include\s*[<"]' "$file" || echo "  None found"
    echo ""
    
    echo "Structs:"
    grep -E '^struct\s+[a-zA-Z_][a-zA-Z0-9_]*' "$file" 2>/dev/null || echo "  None found"
    echo ""
    
    echo "Potential Issues:"
    if grep -qE 'strcpy|strcat|sprintf|scanf|gets' "$file"; then
        echo "  ⚠️  Found unsafe function calls"
    fi
    if grep -qE 'malloc' "$file" && ! grep -qE '== NULL|NULL =='; then
        echo "  ⚠️  malloc without NULL check"
    fi
    if grep -qE 'malloc' "$file" && ! grep -qE 'free'; then
        echo "  ⚠️  Potential memory leak"
    fi
    echo ""
}

# Function to generate C template
generate_c_template() {
    local template=$1
    
    case $template in
        "main")
            cat << 'EOF'
#include <stdio.h>
#include <stdlib.h>

int main(int argc, char *argv[]) {
    printf("Hello from Gemini C Assistant\n");
    return EXIT_SUCCESS;
}
EOF
            ;;
        "malloc")
            cat << 'EOF'
int *ptr = (int *)malloc(sizeof(int) * 10);
if (ptr == NULL) {
    fprintf(stderr, "Memory allocation failed\n");
    return EXIT_FAILURE;
}
// Use ptr
free(ptr);
ptr = NULL;
EOF
            ;;
        "struct")
            cat << 'EOF'
typedef struct {
    int id;
    char name[64];
    double value;
} Record;

Record *create_record(int id, const char *name, double value) {
    Record *rec = (Record *)malloc(sizeof(Record));
    if (!rec) return NULL;
    rec->id = id;
    snprintf(rec->name, sizeof(rec->name), "%s", name);
    rec->value = value;
    return rec;
}
EOF
            ;;
        "file")
            cat << 'EOF'
FILE *fp = fopen("data.txt", "r");
if (!fp) {
    perror("fopen failed");
    return EXIT_FAILURE;
}
char buffer[256];
while (fgets(buffer, sizeof(buffer), fp)) {
    printf("%s", buffer);
}
fclose(fp);
EOF
            ;;
        "array")
            cat << 'EOF'
int arr[10] = {0};
for (int i = 0; i < 10; i++) {
    arr[i] = i * 2;
    printf("arr[%d] = %d\n", i, arr[i]);
}
EOF
            ;;
        *)
            echo "Unknown template: $template"
            echo "Available: main, malloc, struct, file, array"
            return 1
            ;;
    esac
}

# Interactive menu
show_menu() {
    echo "Commands:"
    echo "  1) Analyze C file"
    echo "  2) Generate C template"
    echo "  3) Check for unsafe functions"
    echo "  4) Show X11 info"
    echo "  5) Exit"
    echo ""
}

# Main loop
if [ $# -eq 0 ]; then
    while true; do
        show_menu
        read -p "gemini-shell> " choice
        
        case $choice in
            1)
                read -p "Enter C file path: " filepath
                if [ -f "$filepath" ]; then
                    analyze_c_file "$filepath"
                else
                    echo "File not found: $filepath"
                fi
                ;;
            2)
                read -p "Enter template (main/malloc/struct/file/array): " template
                generate_c_template "$template"
                echo ""
                ;;
            3)
                read -p "Enter C file path: " filepath
                if [ -f "$filepath" ]; then
                    echo "Unsafe functions in $filepath:"
                    grep -n -E 'strcpy|strcat|sprintf|scanf|gets' "$filepath" || echo "None found"
                fi
                ;;
            4)
                if command -v xdpyinfo &> /dev/null; then
                    xdpyinfo | head -20
                else
                    echo "X11 tools not available"
                fi
                ;;
            5)
                echo "Goodbye!"
                exit 0
                ;;
            *)
                echo "Invalid choice"
                ;;
        esac
        echo ""
    done
else
    # Command line mode
    case $1 in
        "analyze")
            if [ -f "$2" ]; then
                analyze_c_file "$2"
            else
                echo "File not found: $2"
                exit 1
            fi
            ;;
        "generate")
            generate_c_template "$2"
            ;;
        "unsafe")
            if [ -f "$2" ]; then
                echo "Unsafe functions:"
                grep -n -E 'strcpy|strcat|sprintf|scanf|gets' "$2" || echo "None found"
            else
                echo "File not found: $2"
                exit 1
            fi
            ;;
        *)
            echo "Usage:"
            echo "  gemini-shell.sh                - Interactive mode"
            echo "  gemini-shell.sh analyze <file> - Analyze C file"
            echo "  gemini-shell.sh generate <tmpl> - Generate template"
            echo "  gemini-shell.sh unsafe <file>   - Check for unsafe functions"
            exit 1
            ;;
    esac
fi
