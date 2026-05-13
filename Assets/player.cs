using UnityEngine;

[RequireComponent(typeof(Rigidbody2D))]
public class player : MonoBehaviour
{
    public float moveSpeed = 5f;

    private Rigidbody2D rb;

    public Vector2 moveInput;

    private void Awake()
    {
        rb = GetComponent<Rigidbody2D>();
    }

    private void Update()
    {
        moveInput.x = Input.GetAxis("Horizontal");
        moveInput.y = Input.GetAxis("Vertical");
    }

    private void FixedUpdate()
    {
        rb.linearVelocity = moveInput * moveSpeed;
    }
}
