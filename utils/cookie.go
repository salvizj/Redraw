package utils

import (
	"net/http"
)

func SetSessionCookie(w http.ResponseWriter, sessionId string) {
	http.SetCookie(w, &http.Cookie{
		Name:     "sessionId",
		Value:    sessionId,
		Path:     "/",
		Secure:   true, 
		HttpOnly: false,  
		SameSite: http.SameSiteLaxMode,
	})
}
