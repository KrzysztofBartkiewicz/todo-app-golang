package user

import "testing"

func TestHashPassword(t *testing.T) {
	t.Run("Hashes password successfully", func(t *testing.T) {
		password := "mysecretpassword"
		_, err := HashPassword(password)
		if err != nil {
			t.Fatalf("HashPassword returned an error: %v", err)
		}
	})

	t.Run("Hashes different passwords to different hashes", func(t *testing.T) {
		password1 := "password1"
		password2 := "password2"

		hash1, err1 := HashPassword(password1)
		hash2, err2 := HashPassword(password2)

		if err1 != nil || err2 != nil {
			t.Fatalf("HashPassword returned an error: %v, %v", err1, err2)
		}

		if hash1 == hash2 {
			t.Fatal("HashPassword returned the same hash for different passwords")
		}
	})

	t.Run("CheckPasswordHash returns true for correct password", func(t *testing.T) {
		password := "mysecretpassword"
		hash, err := HashPassword(password)
		if err != nil {
			t.Fatalf("HashPassword returned an error: %v", err)
		}

		if !CheckPasswordHash(password, hash) {
			t.Fatal("CheckPasswordHash returned false for correct password")
		}
	})

	t.Run("CheckPasswordHash returns false for incorrect password", func(t *testing.T) {
		password := "mysecretpassword"
		wrongPassword := "wrongpassword"

		hash, err := HashPassword(password)
		if err != nil {
			t.Fatalf("HashPassword returned an error: %v", err)
		}

		if CheckPasswordHash(wrongPassword, hash) {
			t.Fatal("CheckPasswordHash returned true for incorrect password")
		}
	})

	t.Run("Check empty password", func(t *testing.T) {
		password := ""
		hash, err := HashPassword(password)
		if err != nil {
			t.Fatalf("HashPassword returned an error: %v", err)
		}

		if !CheckPasswordHash(password, hash) {
			t.Fatal("CheckPasswordHash returned false for empty password")
		}
	})

	t.Run("Check hashes for same password are different", func(t *testing.T) {
		password := "mysecretpassword"
		hash1, err1 := HashPassword(password)
		hash2, err2 := HashPassword(password)

		if err1 != nil || err2 != nil {
			t.Fatalf("HashPassword returned an error: %v, %v", err1, err2)
		}

		if hash1 == hash2 {
			t.Fatal("HashPassword returned the same hash for the same password")
		}
	})
}
