using UnityEngine;

public class player : MonoBehaviour
{
    public float moveSpeed = 5f;

    private  Rigidbody2D  rb;

    public Vector3 moveInput;

    private void  Update()
    {
        moveInput.x = Input.GetAxis("Horizontal");
        moveInput.y = Input.GetAxis("Vertical");
        transfrom.position += moveInput * moveSpeed * Time.deltaTime;
    }   
}
