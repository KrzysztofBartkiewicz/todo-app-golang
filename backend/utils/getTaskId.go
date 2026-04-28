package utils

import (
	"net/http"
	"strconv"
	"strings"
)

func GetTaskID(r *http.Request) (int, error) {
	idStr := strings.TrimPrefix(r.URL.Path, "/tasks/")
	return strconv.Atoi(idStr)
}
